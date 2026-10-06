from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Atlas Places API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


class Place(BaseModel):
    id: int
    name: str
    category: str
    neighborhood: str
    address: str
    description: str
    rating: float
    hours: str
    image: str
    latitude: float
    longitude: float


PLACES = [
    Place(id=1, name="The Elk", category="Coffee", neighborhood="West Village", address="128 Charles St, New York", description="A bright neighborhood cafe for a really good coffee and a slow morning.", rating=4.8, hours="8:00 AM – 5:00 PM", image="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=720&q=85", latitude=40.7359, longitude=-74.0061),
    Place(id=2, name="Dominique Ansel Bakery", category="Food & drink", neighborhood="SoHo", address="189 Spring St, New York", description="Inventive French pastries tucked into a leafy, welcoming SoHo courtyard.", rating=4.7, hours="8:00 AM – 6:00 PM", image="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=720&q=85", latitude=40.7244, longitude=-73.9973),
    Place(id=3, name="Washington Square Park", category="Parks", neighborhood="Greenwich Village", address="Washington Square, New York", description="Meet under the arch, listen to the musicians, or just find a spot in the sun.", rating=4.9, hours="Open 24 hours", image="https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=720&q=85", latitude=40.7308, longitude=-73.9973),
    Place(id=4, name="Buvette", category="Food & drink", neighborhood="West Village", address="42 Grove St, New York", description="A tiny, candlelit French bistro that feels like a favorite Parisian corner.", rating=4.6, hours="8:00 AM – 2:00 AM", image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=720&q=85", latitude=40.7328, longitude=-74.0033),
    Place(id=5, name="McNally Jackson Books", category="Shopping", neighborhood="SoHo", address="134 Prince St, New York", description="An independent bookstore made for one more browse and one more book.", rating=4.5, hours="10:00 AM – 8:00 PM", image="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=720&q=85", latitude=40.7245, longitude=-73.9996),
    Place(id=6, name="Whitney Museum of American Art", category="Culture", neighborhood="Meatpacking District", address="99 Gansevoort St, New York", description="Modern American art, an airy terrace, and some of the best city views.", rating=4.6, hours="10:30 AM – 6:00 PM", image="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=720&q=85", latitude=40.7396, longitude=-74.0089),
    Place(id=7, name="Little Ruby's Cafe", category="Coffee", neighborhood="SoHo", address="219 Mulberry St, New York", description="A lively Aussie-style cafe that is always a good idea for brunch.", rating=4.6, hours="8:00 AM – 10:00 PM", image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=720&q=85", latitude=40.7225, longitude=-73.9957),
    Place(id=8, name="Elizabeth Street Garden", category="Parks", neighborhood="Nolita", address="Elizabeth St, New York", description="A secret garden of sculptures and greenery in the middle of downtown.", rating=4.7, hours="10:00 AM – 6:00 PM", image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=720&q=85", latitude=40.7235, longitude=-73.9945),
    Place(id=9, name="Lafayette Grand Café", category="Food & drink", neighborhood="NoHo", address="380 Lafayette St, New York", description="A beautiful French brasserie for a long lunch or an extra-special dinner.", rating=4.5, hours="8:00 AM – 10:00 PM", image="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=720&q=85", latitude=40.7281, longitude=-73.9926),
    Place(id=10, name="The New Museum", category="Culture", neighborhood="Lower East Side", address="235 Bowery, New York", description="Bold contemporary art and a rooftop view worth the trip upstairs.", rating=4.4, hours="11:00 AM – 6:00 PM", image="https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=720&q=85", latitude=40.7224, longitude=-73.9935),
    Place(id=11, name="Kith Soho", category="Shopping", neighborhood="SoHo", address="337 Lafayette St, New York", description="A thoughtfully curated mix of sneakers, streetwear, and New York style.", rating=4.3, hours="11:00 AM – 8:00 PM", image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=720&q=85", latitude=40.7259, longitude=-73.9963),
    Place(id=12, name="Hudson River Park", category="Parks", neighborhood="West Village", address="Hudson River Greenway, New York", description="Room to wander, watch the boats, and catch a pastel-colored sunset.", rating=4.8, hours="Open 24 hours", image="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=720&q=85", latitude=40.7335, longitude=-74.0102),
]


@app.get("/api/places", response_model=list[Place])
def list_places(
    q: str = Query(default="", max_length=100),
    category: str = Query(default="All"),
) -> list[Place]:
    """Search the sample places by name, neighborhood, or category."""
    normalized_query = q.strip().casefold()
    return [
        place
        for place in PLACES
        if (category == "All" or place.category == category)
        and (
            not normalized_query
            or normalized_query
            in f"{place.name} {place.neighborhood} {place.category} {place.address}".casefold()
        )
    ]


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
