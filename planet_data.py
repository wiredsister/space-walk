import requests
from pdb import set_trace
from html.parser import HTMLParser

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
	raw_html = requests.get(planet_url.format(this_planet=planet)).content
	p = Planet_Parser()
	p.feed(raw_html.decode('utf-8'))
	sans_ws = [i for i in p.my_data.split('\n') if not i.isspace()]
	just_data = "\n".join(sans_ws).split("Data Source Descriptions")[0].split('\n')[2:]
	spot = 0
	total = len(just_data)
	planet_record = {}

	while spot != total:
		if ((len(just_data[spot]) - len(just_data[spot].lstrip()) == 4)):
			print("key: " + just_data[spot])
		spot += 1
			# while (len(i) - len(i.lstrip() == 8)):
	return planet_record
