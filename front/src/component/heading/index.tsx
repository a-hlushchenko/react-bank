import "./index.css";

import Grid from "../grid";

const Heading: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <Grid>
      <h1 className="heading__title">{title}</h1>
      <span className="heading__subtitle">{subtitle}</span>
    </Grid>
  );
};

export default Heading;
