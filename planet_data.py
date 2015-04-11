from pdb import set_trace
from html.parser import HTMLParser
import json
import requests

planets = ["mercury", "venus", "earth",
		   "mars", "jupiter", "saturn",
		   "uranus", "neptune"]

data_source = ("https://pds.nasa.gov/ds-view/pds/viewContext.jsp"
			   "?identifier=urn%3Anasa%3Apds%3Acontext%3Atarget%3A"
			   "planet.{this_planet}&version=1.0")

class Planet_Parser(HTMLParser):
	def handle_data(self, data):
		if data.startswith("TARGET PARAMETERS"):
			self.my_data = data

def create_planet_record(planet_url, planet):
	"""Disgusting"""
	if planet.lower() not in planets:
		raise ValueError("Must be a valid planets, choices:" + " ".join(planets))
	raw_html = requests.get(planet_url.format(this_planet=planet)).content
	p = Planet_Parser()
	p.feed(raw_html.decode('utf-8'))
	# Something feels redundant here
	sans_ws = [i for i in p.my_data.split('\n') if not i.isspace()]
	# Venus, Jupiter, Saturn aren't working because of indendation issues. 
	just_data = "\n".join(sans_ws).split("Data Source Descriptions")[0].split('\n')
	just_data = just_data[2:len(just_data) - 1]
	d = just_data
	spot = 0
	total = len(just_data)
	planet_record = {}

	while spot != total:
		jumps = 0
		idents = 1
		if ((len(just_data[spot]) - len(just_data[spot].lstrip()) == 4)):
			# parent
			this_key = just_data[spot].split(':')[0].strip()
			this_value = just_data[spot].split(':')[1].strip()
			planet_record[this_key] = {this_key:this_value}
			while True:
				if spot + idents == total:
					break
				if (((len(just_data[spot + idents])) -
					 len(just_data[spot + idents].lstrip()) == 8)):
					child = [j.strip() for j in just_data[spot + idents].split(":")]
					planet_record[this_key].update([(child[0], child[1])])
					idents += 1
				else:
					break
		spot += 1
	return planet_record

def create_all_planet_records():
	"""
	All the planets scrapped data as a JSON string, currently missing
	Venus, Jupiter, and Saturn
	"""
	payload = {"planets":[]}
	for i in planets:
		payload["planets"].append({i:create_planet_record(data_source, i)})
	return json.dumps(payload)

