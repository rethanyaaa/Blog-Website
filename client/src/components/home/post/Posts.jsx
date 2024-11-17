import React, { useEffect, useState } from "react";
import { API } from "../../../service/api";
import { Box, Grid } from "@mui/material";
import Post from "./Post";
import { Link, useSearchParams } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching posts with category:", category);
      let response = await API.getAllPosts({ category: category || "" });
      if (response.isSuccess) {
        setPosts(response.data);
      } else {
        console.error("Failed to fetch posts", response);
      }
    };
    fetchData();
  }, [category]);

  return (
    <Grid container spacing={3}>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Grid item lg={3} sm={4} xs={12} key={post.id}>
            <Link to={`details/${post._id}`} style={{ textDecoration: 'none', color: 'inherit'}}>
              <Post post={post} />
            </Link>
          </Grid>
        ))
      ) : (
        <Box style={{ color: "#878787", margin: "30px 80px", fontSize: 18 }}>
          No data available to display
        </Box>
      )}
    </Grid>
  );
};

export default Posts;
