const apiAdapter = require("../../apiAdapter");

const { URL_SERVICE_COURSE, HOST_API_GATEWAY } = process.env;

const api = apiAdapter(URL_SERVICE_COURSE);

module.exports = async (req, res) => {
  try {
    const course = await api.get("/api/courses", {
      params: {
        ...req.query,
        status: "published",
      },
    });

    const coursesData = course.data;
    const firstPage = coursesData.data.first_page_url.split("?").pop();
    const lastPage = coursesData.data.last_page_url.split("?").pop();

    coursesData.data.first_page_url = `${HOST_API_GATEWAY}/course?${firstPage}`;
    coursesData.data.last_page_url = `${HOST_API_GATEWAY}/course?${lastPage}`;

    if (coursesData.data.next_page_url) {
      const nextPage = coursesData.data.next_page_url.split("?").pop();
      coursesData.data.next_page_url = `${HOST_API_GATEWAY}/course?${nextPage}`;
    }
    if (coursesData.data.prev_page_url) {
      const prevPage = coursesData.data.prev_page_url.split("?").pop();
      coursesData.data.prev_page_url = `${HOST_API_GATEWAY}/course?${prevPage}`;
    }

    coursesData.data.path = `${HOST_API_GATEWAY}/course`;

    return res.json(coursesData);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res
        .status(500)
        .json({ status: "error", message: "service unavailable" });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
