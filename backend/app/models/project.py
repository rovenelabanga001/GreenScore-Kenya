from datetime import datetime
from sqlalchemy import CheckConstraint
from app import db


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(255),
        nullable=False
    )

    description = db.Column(db.Text)

    category = db.Column(
        db.String(100)
    )

    budget = db.Column(
        db.Numeric(12, 2),
        nullable=False
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="pending"
    )

    owner_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # Relationships
    greenscore = db.relationship(
        "GreenScore",
        backref="project",
        uselist=False,
        cascade="all, delete"
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'funded')",
            name="check_project_status"
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "budget": float(self.budget),
            "status": self.status,
            "owner_id": self.owner_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "greenscore": self.greenscore.to_dict() if self.greenscore else None
        }

    def __repr__(self):
        return f"<Project {self.name}>"