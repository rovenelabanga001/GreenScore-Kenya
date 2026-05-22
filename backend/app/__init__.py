from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    raw_origins = os.getenv("CORS_ALLOWED_ORIGINS", "*")
    cors_origins = "*"
    if raw_origins != "*":
        cors_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(
        app,
        resources={r"/*": {"origins": cors_origins}},
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

    db.init_app(app)
    migrate.init_app(app, db)

    from app.models.user import User
    from app.models.project import Project
    from app.models.greenscore import GreenScore

    from app.routes.auth import auth_bp
    from app.routes.project import project_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(project_bp, url_prefix="/projects")

    return app