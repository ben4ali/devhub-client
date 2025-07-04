import { FC, useState } from "react";
import { User } from "../../types/User";
import { ChangeProfilePictureModal } from "../modals/changePfpModal";

interface ProfilePictureProps {
  user: User;
  isCurrentUser?: boolean;
}

export const ProfilPicture: FC<ProfilePictureProps> = ({
  user,
  isCurrentUser,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="absolute top-[29%] left-[3%] md:top-[40%]">
      <div
        className={`absolute md:top-[42%] ${
          isCurrentUser ? "group cursor-pointer" : ""
        } h-36 w-36 md:h-60 md:w-60`}
        onClick={isCurrentUser ? handleOpenModal : undefined}
      >
        <img
          src={`${user.avatar || ""}?t=${new Date().getTime()}`}
          alt="profil-pic"
          crossOrigin="anonymous"
          className="h-full w-full rounded-full border-[7px] border-white/30 object-cover shadow-[0px_0px_20px_5px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-in-out group-hover:-translate-y-[1%] group-hover:scale-[1.005] group-hover:shadow-[0px_15px_22px_10px_rgba(0,0,0,0.2)]"
          referrerPolicy="no-referrer"
        />
      </div>

      <ChangeProfilePictureModal
        currentPfp={user.avatar || ""}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={user.id}
      />
    </div>
  );
};
