/**
 *
 * NewChapterArrow
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
import SvgWrapper from '../SvgWrapper';

const NewChapterArrow = ({
  clickHandler,
  getNewUrl,
  disabled,
  svgid,
  svgClasses,
  containerClasses,
  urlProps,
  disabledContainerClasses,
  title,
  id,
  textProps,
}) => {
  if (disabled) {
    return (
      <div className={disabledContainerClasses || 'arrow-wrapper disabled'} />
    );
  }

  return (
    <Link
      as={getNewUrl({
        ...urlProps,
        isHref: false,
      })}
      href={getNewUrl({
        ...urlProps,
        isHref: true,
      })}
    >
      <div
        onClick={clickHandler}
        className={containerClasses || 'arrow-wrapper'}
        title={title || ''}
        id={id || ''}
      >
        <SvgWrapper className={svgClasses || 'arrow-svg'} svgid={svgid} />
        {!!textProps && <FormattedMessage {...textProps} />}
      </div>
    </Link>
  );
};

NewChapterArrow.propTypes = {
  getNewUrl: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  title: PropTypes.string,
  svgid: PropTypes.string,
  svgClasses: PropTypes.string,
  containerClasses: PropTypes.string,
  disabledContainerClasses: PropTypes.string,
  urlProps: PropTypes.object,
  textProps: PropTypes.object,
  clickHandler: PropTypes.func,
};

export default NewChapterArrow;
