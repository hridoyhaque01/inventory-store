export const Pagination = ({
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  totalRows,
}) => {
  const handleIncrement = () => {
    if (currentPage * rowsPerPage >= totalRows) {
      return;
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (currentPage <= 1) {
      return;
    } else {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleItemsPerPage = (value) => {
    setCurrentPage(1);
    setRowsPerPage(value);
  };

  return (
    <section className="flex items-center justify-end gap-4 text-darkHigh w-full flex-nowrap whitespace-nowrap pr-6">
      {/* <div>{renderPagination()}</div> */}

      <div className="flex items-center gap-2">
        <p className="font-semibold text-sm sm:text-base ">Item per page:</p>
        <div className="dropdown dropdown-top dropdown-end">
          <label
            tabIndex={3}
            className="rounded-lg px-2 py-2 border border-blackLow  cursor-pointer flex items-center"
          >
            {rowsPerPage} &nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5.83398 7.91669L10.0007 12.0834L14.1673 7.91669H5.83398Z"
                fill="#6C6C6C"
              />
            </svg>
          </label>
          <ul
            tabIndex={3}
            className="dropdown-content menu p-1 mt-2 m-0.5 shadow bg-whiteHigh rounded-md"
          >
            <li>
              <p onClick={() => handleItemsPerPage(10)} className="py-1">
                10
              </p>
            </li>
            <hr className="text-disabledColor opacity-10" />
            <li>
              <p onClick={() => handleItemsPerPage(25)} className="py-1">
                25
              </p>
            </li>
            <hr className="text-disabledColor opacity-10" />
            <li>
              <p onClick={() => handleItemsPerPage(50)} className="py-1">
                50
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <p>
          {currentPage} - {Math.min(rowsPerPage * currentPage, totalRows)} of{" "}
          {totalRows}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={handleDecrement}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15.7049 16.59L11.1249 12L15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59Z"
              fill="#474747"
            />
          </svg>
        </button>
        <button type="button" onClick={handleIncrement}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8.29492 16.59L12.8749 12L8.29492 7.41L9.70492 6L15.7049 12L9.70492 18L8.29492 16.59Z"
              fill="#474747"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};
