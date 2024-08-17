//movie create(create)
//movie list(list)
//get one movie(getById)
//update release date(updateReleases)
//update movie details(update)
//update seat number(updateSeats)
//delete movie()



const movieModel = require("./movie.model");
const { slugger } = require("../../utils/text");

// movie create (create)
const create = async (payload) => {
  // create slug from title (slugify)

  const slug = slugger(payload?.title);
  const movie = await movieModel.findOne({ slug });
  if (movie) throw new Error("Movie title is already in use");
  // create the movie
  payload.slug = slug;
  return movieModel.create(payload);
};

// movie list (list)
const list = async ({ page = 1, limit = 10, search }) => {
  const query = [];
  // Search
  if (search?.title) {
    query.push({
      $match: {
        title: new RegExp(search?.title, "gi"),
      },
    });
  }
  // Sort
  query.push({
    $sort: {
      createdAt: 1,
    },
  });
  // Pagination
  query.push(
    {
      $facet: {
        metadata: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (+page - 1) * +limit,
          },
          {
            $limit: +limit,
          },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["$metadata.total", 0],
        },
      },
    },
    {
      $project: {
        metadata: 0,
        "data.createdBy": 0,
        "data._id": 0,
      },
    }
  );
  const result = await movieModel.aggregate(query);
  return {
    total: result[0]?.total || 0,
    movies: result[0]?.data,
    page: +page,
    limit: +limit,
  };
};


// get one movie (getById)
const getBySlug = (slug) => {
  return movieModel.findOne({ slug });
};

// update release Date (updateReleaseDate)
const updateReleaseDate = (id, payload) => {
  // check releaseDate is less than today (moment, luxon, date-fns)
  const dateToCheck = moment('2024-05-2');
  const isToday = dateToCheck.isSame(moment(), 'day');
  return movieModel.findOneAndUpdate({ _id: id }, payload, { new: true });
};

// update Movie Detail (update)
const update = (slug, payload) => {
  return movieModel.updateOne({ slug }, payload);
};

// update Seat Number (updateSeats)
const updateSeats = (id, payload) => {
  // check if the movie seats are less than defined number
  const updateSeat = process.env.SEAT_NUM;
  if (updateSeat < SEAT_NUM) {

  }


  return movieModel.findOneAndUpdate({ _id: id }, payload, { new: true });
};

// delete movie (remove)
const remove = (id) => {
  // movie ticket should not be sold
  // movie should not be ongoing (should not be in betwn release date & end Date)
  return movieModel.deleteOne({ _id: id });
};

module.exports = {
  create,
  list,
  getBySlug,
  updateReleaseDate,
  update,
  updateSeats,
  remove,
};