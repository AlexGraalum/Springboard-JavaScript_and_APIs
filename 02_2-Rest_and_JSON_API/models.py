"""Models for Cupcake app."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Cupcake(db.Model):
    __tablename__ = "cupcakes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flavor = db.Column(db.Text, unique=False, nullable=False)
    size = db.Column(db.Text, unique=False, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    image = db.Column(db.Text, unique=False, nullable=False, default="https://tinyurl.com/demo-cupcake")

    def to_dict(self):
        return{
            "id": self.id,
            "flavor": self.flavor,
            "size": self.size,
            "rating": self.rating,
            "image": self.image
        }

def connect_db(app):
    with app.app_context():
        db.app = app
        db.init_app(app)
        ## ERROR MESSAGE FROM HERE
# sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL: database "cupcakes" does not exist
        db.create_all()