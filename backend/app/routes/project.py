from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models.project import Project

project_bp = Blueprint("projects", __name__)


@project_bp.route("/", methods=["POST"])
@jwt_required()
def create_project():

    current_user_id = get_jwt_identity()
    claims = get_jwt()

    role = claims.get("role")

    # Only project owners can create projects
    if role != "project_owner":
        return jsonify({
            "error": "Unauthorized"
        }), 403

    data = request.get_json()

    name = data.get("name")
    description = data.get("description")
    category = data.get("category")
    budget = data.get("budget")

    if not name or not budget:
        return jsonify({
            "error": "Name and budget are required"
        }), 400

    project = Project(
        name=name,
        description=description,
        category=category,
        budget=budget,
        owner_id=current_user_id
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        "message": "Project created successfully",
        "project": project.to_dict()
    }), 201