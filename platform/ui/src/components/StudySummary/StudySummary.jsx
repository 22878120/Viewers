import React from 'react';
import PropTypes from 'prop-types';

const StudySummary = ({ date, modality, description }) => {
  return (
    <div className={px("p-2")}>
      <div className={px("leading-none")}>
        <span className={px("mr-2 text-base text-white")}>{date}</span>
        <span className={px("px-1 text-base font-bold text-black rounded-sm bg-common-bright")}>
          {modality}
        </span>
      </div>
      <div className={px("pt-2 text-base leading-none truncate text-primary-light ellipse")}>
        {description}
      </div>
    </div>
  );
};

StudySummary.propTypes = {
  date: PropTypes.string.isRequired,
  modality: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default StudySummary;
