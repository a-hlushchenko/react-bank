import "./index.css";

const Grid: React.FC<{
  children: React.ReactNode;
  big?: boolean;
  middle?: boolean;
}> = ({ children, big, middle }) => {
  return (
    <div
      className={`grid${big ? " grid--big" : ""} ${
        middle ? " grid--middle" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Grid;
