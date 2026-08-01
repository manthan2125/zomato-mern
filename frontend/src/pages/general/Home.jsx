import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";

const Home = () => {
  const [videos, setVideos] = useState([]);
  // Autoplay behavior is handled inside ReelFeed

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", { withCredentials: true })
      .then((response) => {
        // console.log(response.data);
        setVideos(response.data.foodItems);
      })
      .catch((error) => {
        console.error("Failed to fetch food items:", error);

        // If the backend sends an error response
        if (error.response) {
          console.error(error.response.data.message);
        }
      });
  }, []);

  // Using local refs within ReelFeed; keeping map here for dependency parity if needed

  async function likeVideo(item) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: item._id },
        { withCredentials: true },
      );
      if (response.data.like) {
        // prev is videos array -  v - ye uss videos array ka object hai jo ki food ko represent kr rha hai.
        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v));
      } else {
        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v));
      }
    } catch (error) {
      console.error(error.response?.data);
    }
  }

  async function saveVideo(item) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: item._id },
        { withCredentials: true },
      );
      if (response.data.save) {
        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, saveCount: v.saveCount + 1 } : v));
      } else {
        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, saveCount: v.saveCount - 1 } : v));
      }
    } catch (error) {
      console.error(error.response?.data);
    }
  }

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      emptyMessage="No videos available."
    />
  );
};

export default Home;
