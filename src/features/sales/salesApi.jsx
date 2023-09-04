import { apiSlice } from "../api/apiSlice";

const salesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query({
      query: (id) => ({
        url: `/invoices/store/${id}`,
      }),
      // providesTags: ["products"],
    }),

    addSales: builder.mutation({
      query: (data) => ({
        url: "/invoices/add",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              apiSlice.util.updateQueryData(
                "getSales",
                result?.data?.storeId,
                (draft) => {
                  draft?.push(result?.data);
                }
              )
            );
            dispatch(
              apiSlice.util.updateQueryData(
                "getAllOwes",
                undefined,
                (draft) => {
                  draft?.push(result?.data);
                }
              )
            );
            // dispatch(owesApi.endpoints.getAllOwes)

            // dispatch(
            //   messagesApi.endpoints.addMessage.initiate({
            //     conversationId: conversation?.data?.id,
            //     sender: senderUser,
            //     receiver: receiverUser,
            //     message: data.message,
            //     timestamp: data.timestamp,
            //   })
            // );
          }
        } catch (error) {
          console.log(error);
        }
      },
      invalidatesTags: ["dashboard", "moneyOwes"],
    }),
    updateSales: builder.mutation({
      query: ({ data, id }) => ({
        url: `/invoices/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      // invalidatesTags: ["products"],
      async onQueryStarted({ data, id }, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data) {
            dispatch(
              apiSlice.util.updateQueryData(
                "getInventories",
                undefined,
                (draft) => {
                  const index = draft.findIndex(
                    (prdouct) => prdouct.productId === id
                  );
                  if (index !== -1) {
                    draft[index] = result?.data;
                  }
                }
              )
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

export const { useGetSalesQuery, useAddSalesMutation, useUpdateSalesMutation } =
  salesApi;
