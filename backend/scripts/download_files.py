import asyncio
import httpx
from pathlib import Path
import gzip
import csv
from tqdm import tqdm

DOWNLOAD_FOLDER = Path(__file__).parent / "downloads"
DOWNLOAD_FOLDER.mkdir(exist_ok=True)
BASICS_FILEPATH = DOWNLOAD_FOLDER / "title.basics.tsv.gz"



def filter_basiscs_file():
    """
    Reads the basics file and filters it to only include tvSeries and tvEpisode
    Save the filtered file to title.basics.filtered.tsv.gz
    """
    with gzip.open(BASICS_FILEPATH, "rt") as f:
        reader = csv.DictReader(f, delimiter="\t")
        filtered_rows = []
        for row in tqdm(reader, total = 9624114):
            if row["titleType"] in ["tvSeries", "tvEpisode"]:
                filtered_rows.append(row)

    print("Filtered rows: ", len(filtered_rows))
    with gzip.open(DOWNLOAD_FOLDER / "title.basics.filtered.tsv.gz", "wt") as f:
        writer = csv.DictWriter(f, fieldnames=reader.fieldnames, delimiter="\t")
        writer.writeheader()
        writer.writerows(filtered_rows)



async def download_file(url: str) -> None:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        file_name = url.split("/")[-1]
        file_path = DOWNLOAD_FOLDER / file_name
        with open(file_path, "wb") as f:
            f.write(response.content)
            print(f"Downloaded {file_name}")


        if "basics" in file_name:
            print("Filtering basics file")
            filter_basiscs_file()
            print("Done filtering basics file")




async def main():
    urls = [
        "https://datasets.imdbws.com/title.ratings.tsv.gz",
        "https://datasets.imdbws.com/title.basics.tsv.gz",
        "https://datasets.imdbws.com/title.episode.tsv.gz",
    ]
    tasks = [download_file(url) for i, url in enumerate(urls)]
    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
