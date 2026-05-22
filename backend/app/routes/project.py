from datetime import datetime
from flask import Blueprint, request, jsonify
from app import db
from app.models.greenscore import GreenScore
from app.models.project import Project
from app.models.user import User

project_bp = Blueprint("projects", __name__)


def _parse_score(payload, field_name):
    raw_value = payload.get(field_name)

    if raw_value is None:
        raise ValueError(f"{field_name} is required")

    try:
        score = float(raw_value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{field_name} must be a number") from exc

    if score < 0 or score > 100:
        raise ValueError(f"{field_name} must be between 0 and 100")

    return score


def _rank_probability(total_score, target_score):
    if target_score is None:
        # Baseline conversion confidence when no target is configured.
        score = 0.4 + (max(0.0, min(total_score, 100.0)) / 100.0) * 0.55
    else:
        gap = total_score - target_score
        if gap >= 20:
            score = 0.95
        elif gap >= 0:
            score = 0.75 + (gap / 20.0) * 0.2
        else:
            score = max(0.1, 0.7 + (gap / 40.0) * 0.6)

    if score >= 0.8:
        label = "high"
    elif score >= 0.5:
        label = "medium"
    else:
        label = "low"

    return round(score, 2), label


@project_bp.route("/", methods=["POST"])
def create_project():

    data = request.get_json() or {}

    name = data.get("name")
    description = data.get("description")
    category = data.get("category")
    county = data.get("county")
    budget = data.get("budget")
    owner_id = data.get("owner_id")

    if not name or not budget or not owner_id:
        return jsonify({
            "error": "Name, budget and owner_id are required"
        }), 400

    user = User.query.get(owner_id)

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    if user.role != "project_owner":
        return jsonify({
            "error": "Only project owners can create projects"
        }), 403

    try:
        budget_value = float(budget)
    except (TypeError, ValueError):
        return jsonify({
            "error": "budget must be a valid number"
        }), 400

    if budget_value <= 0:
        return jsonify({
            "error": "budget must be greater than zero"
        }), 400

    try:
        environmental_impact = _parse_score(data, "environmental_impact")
        social_impact = _parse_score(data, "social_impact")
        governance_and_transparency = _parse_score(data, "governance_and_transparency")
        financial_readiness = _parse_score(data, "financial_readiness")
        climate_risk_adjustment = _parse_score(data, "climate_risk_adjustment")
    except ValueError as exc:
        return jsonify({
            "error": str(exc)
        }), 400

    project = Project(
        name=name,
        description=description,
        category=category,
        county=county,
        budget=budget_value,
        owner_id=owner_id
    )

    greenscore = GreenScore(
        project=project,
        environmental_impact=environmental_impact,
        social_impact=social_impact,
        governance_and_transparency=governance_and_transparency,
        financial_readiness=financial_readiness,
        climate_risk_adjustment=climate_risk_adjustment,
    )
    greenscore.calculate_total_score()

    db.session.add(project)
    db.session.add(greenscore)
    db.session.commit()

    return jsonify({
        "message": "Project created successfully",
        "project": project.to_dict()
    }), 201


@project_bp.route("/all", methods=["GET"])
def get_projects():

    projects = Project.query.all()

    return jsonify({
        "count": len(projects),
        "projects": [project.to_dict() for project in projects]
    }), 200


@project_bp.route("/owner/<int:owner_id>", methods=["GET"])
def get_owner_projects(owner_id):

    owner = User.query.get(owner_id)
    if not owner:
        return jsonify({"error": "User not found"}), 404

    if owner.role != "project_owner":
        return jsonify({"error": "User is not a project owner"}), 400

    projects = Project.query.filter_by(owner_id=owner_id).all()
    return jsonify({
        "count": len(projects),
        "projects": [project.to_dict() for project in projects]
    }), 200


@project_bp.route("/marketplace", methods=["GET"])
def get_marketplace_projects():

    funder_id = request.args.get("funder_id", type=int)
    min_score = request.args.get("min_score", type=float)

    target_score = None
    if funder_id is not None:
        funder = User.query.get(funder_id)
        if not funder:
            return jsonify({"error": "Funder not found"}), 404
        if funder.role != "funder":
            return jsonify({"error": "Only funders can access marketplace ranking"}), 403
        target_score = funder.target_green_score

    projects = Project.query.filter_by(status="pending").all()
    ranked_projects = []

    threshold = min_score if min_score is not None else target_score

    for project in projects:
        if not project.greenscore:
            continue

        score = project.greenscore.total_score
        if threshold is not None and score < threshold:
            continue

        probability, label = _rank_probability(score, target_score)
        payload = project.to_dict()
        payload["funding_match_probability"] = probability
        payload["funding_match_label"] = label
        ranked_projects.append(payload)

    ranked_projects.sort(
        key=lambda item: (
            item.get("funding_match_probability", 0),
            item.get("greenscore", {}).get("total_score", 0)
        ),
        reverse=True
    )

    return jsonify({
        "count": len(ranked_projects),
        "target_green_score": target_score,
        "projects": ranked_projects
    }), 200


@project_bp.route("/<int:project_id>/fund", methods=["POST"])
def fund_project(project_id):

    data = request.get_json() or {}
    funder_id = data.get("funder_id")
    amount = data.get("amount")

    if funder_id is None or amount is None:
        return jsonify({"error": "funder_id and amount are required"}), 400

    try:
        amount_value = float(amount)
    except (TypeError, ValueError):
        return jsonify({"error": "amount must be a valid number"}), 400

    if amount_value <= 0:
        return jsonify({"error": "amount must be greater than zero"}), 400

    funder = User.query.get(funder_id)
    if not funder:
        return jsonify({"error": "Funder not found"}), 404

    if funder.role != "funder":
        return jsonify({"error": "Only funders can fund projects"}), 403

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    if project.status == "funded":
        return jsonify({"error": "Project is already funded"}), 409

    project.status = "funded"
    project.funded_by = funder.id
    project.funded_amount = amount_value
    project.funded_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "message": "Project funded successfully",
        "project": project.to_dict()
    }), 200


# GET SINGLE PROJECT
@project_bp.route("/<int:id>", methods=["GET"])
def get_project(id):

    project = Project.query.get(id)

    if not project:
        return jsonify({
            "error": "Project not found"
        }), 404

    return jsonify({
        "project": project.to_dict()
    }), 200