import { apiSlice } from "../api/apiSlice";

export const owesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOwes: builder.query({
      query: (id) => ({
        url: `/owes/store/${id}`,
      }),
      providesTags: ["moneyOwes"],
    }),
    updateOwes: builder.mutation({
      query: ({ data, id, storeId }) => ({
        url: `/owes/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(
        { data, id, storeId },
        { queryFulfilled, dispatch }
      ) {
        try {
          const result = await queryFulfilled;
          const formData = JSON.parse(data.get("data"));
          if (result?.data) {
            dispatch(
              apiSlice.util.updateQueryData("getAllOwes", storeId, (draft) => {
                const changeObj = draft.find((customer) => customer._id === id);
                if (changeObj) {
                  changeObj.dueAmount = formData.dueAmount;
                  changeObj.paidAmount = formData.paidAmount;
                  changeObj.payDate = formData.payDate;
                }
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
      invalidatesTags: ["dashboard"],
    }),
  }),
});

export const { useGetAllOwesQuery, useUpdateOwesMutation } = owesApi;
