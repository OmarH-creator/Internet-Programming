// Reusable profile circle component
// Shows avatar image or first letter of username
function ProfileCircle({ user, size = 24 }) {
  const username = user?.username || "?";
  const avatar = user?.avatar;
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: "#ff4500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0
      }}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={username}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      ) : (
        <span
          style={{
            color: "#ffffff",
            fontSize: `${size / 2}px`,
            fontWeight: "700"
          }}
        >
          {firstLetter}
        </span>
      )}
    </div>
  );
}

export default ProfileCircle;
