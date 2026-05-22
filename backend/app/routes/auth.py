from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)

VALID_ROLES = ["funder", "project_owner"]
EMAIL_RESET_MESSAGE = "If an account with that email exists, a password reset link has been sent."


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not username or not email or not password or not role:
        return jsonify({
            "error": "All fields are required"
        }), 400

    if role not in VALID_ROLES:
        return jsonify({
            "error": "Invalid role"
        }), 400

    existing_user = User.query.filter(
        (User.email == email) |
        (User.username == username)
    ).first()

    if existing_user:
        return jsonify({
            "error": "User already exists"
        }), 409

    user = User(
        username=username,
        email=email,
        role=role
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Registration successful",
        "user": user.to_dict()
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful",
        "role": user.role,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():

    return jsonify({
        "message": "Logout successful"
    }), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return jsonify({
            "error": "Email is required"
        }), 400

    normalized_email = email.strip().lower()
    if "@" not in normalized_email or "." not in normalized_email:
        return jsonify({
            "error": "Invalid email address"
        }), 400

    # Keep response identical whether account exists or not.
    user = User.query.filter_by(email=normalized_email).first()
    if user:
        # TODO: trigger email provider with reset link when service is available.
        pass

    return jsonify({
        "message": EMAIL_RESET_MESSAGE
    }), 200