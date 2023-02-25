import csv
from constants import BASICS_FILTERED_FILEPATH, BASICS_FILEPATH

keep_columns = [0, 1, 2, 5, 6]
header_row = ["tconst", "titleType", "primaryTitle", "startYear", "endYear"]


with open(BASICS_FILEPATH, mode="rt", encoding="utf-8") as f_in, open(
    BASICS_FILTERED_FILEPATH, mode="wt", encoding="utf-8", newline=""
) as f_out:
    # we need to use the pipe as the delimeter because psycopg2 can't handle tabs
    reader = csv.reader(f_in, delimiter="\t")
    writer = csv.writer(f_out, delimiter="|")

    # Skip the header row
    _ = next(reader)

    # Write the header row to the output file
    writer.writerow(header_row)

    # Loop through each row in the input file
    for row in reader:
        # Filter the row to only keep the specified columns
        filtered_row = [row[i] for i in keep_columns]

        title_type = filtered_row[1]

        if not (
            title_type == "tvSeries"
            or title_type == "tvMiniSeries"
            or title_type == "tvEpisode"
        ):
            continue

        # Write the filtered row to the output file
        writer.writerow(filtered_row)
