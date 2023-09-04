import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { avatar } from "../../assets/getAssets";

function Profile() {
  const { store } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  console.log(store);

  return (
    <section className="h-full w-full overflow-auto px-4 md:px-6 py-6">
      <div className="shadow-sm w-full rounded-2xl overflow-hidden">
        <div className="bg-primaryMainDarkest p-4">
          <h4 className=" text-whiteHigh text-xl lg:text-2xl font-bold">
            {t("editProfile")}
          </h4>
        </div>
        <div className="bg-whiteHigh w-full px-4">
          <div className=" w-full max-w-[620px] mx-auto py-6">
            <form action="">
              <div className="flex flex-col justify-start gap-6">
                {/* name */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("forms.storeName")} :
                  </span>
                  <input
                    type="text"
                    placeholder={t("forms.storeName")}
                    readOnly
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm bg-whiteMid"
                    defaultValue={store?.name}
                  />
                </div>
                {/* profile pic */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("forms.store_img")} :
                  </span>
                  <div>
                    <img
                      src={store?.fileUrl || avatar}
                      alt=""
                      className="w-28 h-28 lg:w-40 lg:h-40 rounded-full object-cover bg-cover border border-blueLight"
                    />
                  </div>
                </div>
                {/* Email: */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("forms.email")} :
                  </span>
                  <input
                    type="text"
                    placeholder={t("forms.email")}
                    readOnly
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm bg-whiteMid"
                    defaultValue={store?.email}
                  />
                </div>
                {/* phone no */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <span className="inline-block w-[140px] shrink-0 whitespace-nowrap text-sm sm:text-base text-left md:text-right">
                    {t("tables.address")} :
                  </span>
                  <input
                    type="text"
                    placeholder={t("tables.address")}
                    readOnly
                    className="w-full py-3 px-4 border border-whiteLow outline-none rounded text-blackLow text-sm bg-whiteMid"
                    defaultValue={store?.location}
                  />
                </div>
                {/* edit button */}
                <div className="flex items-center justify-end gap-3 sm:gap-6">
                  <Link
                    to="/"
                    className="btn w-full max-w-[160px]  rounded-full font-medium border bg-transparent hover:bg-transparent border-errorLightColor hover:border-errorLightColor text-errorLightColor text-center text-xs sm:text-base"
                  >
                    {t("buttons.cancel")}
                  </Link>
                  <Link
                    to="/edit-store-profile"
                    className="btn w-full max-w-max  px-4 sm:px-6 rounded-full bg-primaryMainLight hover:bg-primaryMainLight font-medium text-whiteHigh text-center text-xs sm:text-base"
                  >
                    {t("buttons.editStore")}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
