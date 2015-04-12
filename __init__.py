from flask import Flask, render_template
import planet_data

space_walk = Flask(__name__)

@space_walk.route("/")
def home_page():
	return render_template("index.html")

@space_walk.route("/planetsdata")
def retrieve_planets_data():
	return planet_data.create_all_planet_records()

if __name__ == '__main__':
	space_walk.run(debug=True)
