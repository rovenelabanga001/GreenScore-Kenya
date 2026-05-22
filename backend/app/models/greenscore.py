from datetime import datetime
from app import db


class GreenScore(db.Model):
    __tablename__ = "greenscores"

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id"),
        nullable=False,
        unique=True
    )

    environmental_impact = db.Column(
        db.Float,
        default=0
    )

    social_impact = db.Column(
        db.Float,
        default=0
    )

    governance_and_transparency = db.Column(
        db.Float,
        default=0
    )

    financial_readiness = db.Column(
        db.Float,
        default=0
    )

    climate_risk_adjustment = db.Column(
        db.Float,
        default=0
    )

    total_score = db.Column(
        db.Float,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def calculate_total_score(self):
        self.total_score = (
            self.environmental_impact +
            self.social_impact +
            self.governance_and_transparency +
            self.financial_readiness +
            self.climate_risk_adjustment
        ) / 5

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "environmental_impact": self.environmental_impact,
            "social_impact": self.social_impact,
            "governance_and_transparency": self.governance_and_transparency,
            "financial_readiness": self.financial_readiness,
            "climate_risk_adjustment": self.climate_risk_adjustment,
            "total_score": self.total_score,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<GreenScore Project ID {self.project_id}>"