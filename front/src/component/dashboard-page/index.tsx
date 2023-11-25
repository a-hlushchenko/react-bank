import "./index.css";

import BackButton from "../back-button";

const DashboarPage: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => {
  return (
    <div className="page dashboard-page">
      <div className="dashboard__header">
        <BackButton />
        <h1 className="dasboard__title">{title}</h1>
        <span></span>
      </div>

      {children}
    </div>
  );
};

export default DashboarPage;
