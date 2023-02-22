DROP TABLE episodes;
DROP TABLE search;

CREATE TABLE episodes AS
    SELECT b.*, r.num_votes, r.average_rating, e.episode_number, e.season_number, e.parent_tconst
    FROM basics b
    INNER JOIN ratings r ON r.tconst=b.tconst
    INNER JOIN episode_index e ON e.tconst=b.tconst
    WHERE title_type='tvEpisode'
    ORDER BY b.tconst, e.season_number, e.episode_number;

CREATE TABLE search AS
    SELECT b.*, r.num_votes, to_tsvector(b.primary_title) AS primary_title_vector
    FROM basics b
    INNER JOIN ratings r ON r.tconst=b.tconst
    WHERE title_type='tvSeries' OR title_type='tvMiniSeries'
    AND r.num_votes > 100;

CREATE INDEX search_primary_title_vector_idx ON search USING GIN(primary_title_vector);
CREATE INDEX parent_tconst_index ON episodes (parent_tconst);
ALTER TABLE episodes ADD PRIMARY KEY (tconst);
ALTER TABLE search ADD PRIMARY KEY (tconst);
