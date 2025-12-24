from flask import Flask, render_template
from owslib.wms import WebMapService
from io import BytesIO
import base64

app = Flask(__name__)


@app.route("/")
def index():
    # Connect to NASA GIBS
    wms = WebMapService("https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?")

    # Request MODIS NDVI layer directly (NASA provides pre-calculated NDVI)
    # Using MODIS Terra Vegetation Indices layer
    img = wms.getmap(
        layers=["MODIS_Terra_NDVI"],  # Pre-calculated NDVI layer
        srs="EPSG:4326",
        bbox=(-180, -90, 180, 90),  # Global view
        size=(800, 400),
        format="image/png",
    )

    # Convert to base64 for HTML
    img_data = BytesIO(img.read())
    img_base64 = base64.b64encode(img_data.getvalue()).decode("utf-8")

    return render_template("index.html", image_data=img_base64)


if __name__ == "__main__":
    app.run(debug=True)
