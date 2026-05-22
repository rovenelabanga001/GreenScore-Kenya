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

    county = db.Column(
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

    funded_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

    funded_amount = db.Column(
        db.Numeric(12, 2),
        nullable=True
    )

    funded_at = db.Column(
        db.DateTime,
        nullable=True
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

    funder = db.relationship(
        "User",
        foreign_keys=[funded_by],
        back_populates="funded_projects",
        uselist=False
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
            "county": self.county,
            "budget": float(self.budget),
            "status": self.status,
            "owner_id": self.owner_id,
            "funded_by": self.funded_by,
            "funded_amount": float(self.funded_amount) if self.funded_amount is not None else None,
            "funded_at": self.funded_at.isoformat() if self.funded_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "greenscore": self.greenscore.to_dict() if self.greenscore else None
        }

    def __repr__(self):
        return f"<Project {self.name}>"