import axios from "axios";

const API_URL = "https://store-api.softclub.tj";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  Accept: "*/*",
});

export const getColors = async (
  search = "",
  pageNumber = 1,
  pageSize = 20
) => {
  try {
    const response = await axios.get(`${API_URL}/Color/get-colors`, {
      params: {
        ColorName: search,
        PageNumber: pageNumber,
        PageSize: pageSize,
      },
      headers: authHeader(),
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addColor = async (colorName: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/Color/add-color`,
      null,
      {
        params: { ColorName: colorName },
        headers: authHeader(),
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateColor = async (id: number, colorName: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/Color/update-color`,
      null,
      {
        params: { Id: id, ColorName: colorName },
        headers: authHeader(),
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteColor = async (id: number) => {
  try {
    const response = await axios.delete(
      `${API_URL}/Color/delete-color`,
      {
        params: { Id: id },
        headers: authHeader(),
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
