import asyncio
import httpx
from pathlib import Path

DOWNLOAD_FOLDER = Path(__file__).parent / "downloads"
DOWNLOAD_FOLDER.mkdir(exist_ok=True)

async def download_file(url: str) -> None:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        file_name = url.split("/")[-1]
        file_path = DOWNLOAD_FOLDER / file_name
        with open(file_path, "wb") as f:
            f.write(response.content)
            print(f"Downloaded {file_name}")


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
