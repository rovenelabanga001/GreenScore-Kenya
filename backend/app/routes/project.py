from flask import Blueprint, request, jsonify
from app import db
from app.models.project import Project
from app.models.user import User

project_bp = Blueprint("projects", __name__)


@project_bp.route("/", methods=["POST"])
def create_project():

    data = request.get_json()

    name = data.get("name")
    description = data.get("description")
    category = data.get("category")
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

    project = Project(
        name=name,
        description=description,
        category=category,
        budget=budget,
        owner_id=owner_id
    )

    db.session.add(project)
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