import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video

  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(401, "Fill the title and description");
  }
  const videoFilePath = req.files?.videoFile[0]?.path;
  const thumbnailPath = req.files?.thumbnail[0]?.path;

  if (!videoFilePath) {
    throw new ApiError(400, "video field is required");
  }
  if (!thumbnailPath) {
    throw new ApiError(400, "thumbnail field is required");
  }

  const videofile = await uploadOnCloudinary(videoFilePath);
  const thumbnail = await uploadOnCloudinary(thumbnailPath);

  if (!videofile || !thumbnail) {
    throw new ApiError(401, "Both video and thumbnail files are required");
  }

  console.log(videofile);

  const videoData = await Video.create({
    videoFile: videofile.url,
    thumbnail: thumbnail.url,
    title,
    duration : videofile.duration,
    description,
    owner: req.user?._id,
  });

  if (!videoData) {
    throw new ApiError(500, "Somethig went wrong while uploading the video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, videoData, "Video uploades successfully"));

});

const getVideoById = asyncHandler(async (req, res) => {
  
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
