import React from 'react';
import styled from '@emotion/styled';

import space from 'app/styles/space';
import getDynamicText from 'app/utils/getDynamicText';
import DateTime from 'app/components/dateTime';
import {SpanDetailContainer} from 'app/components/events/interfaces/spans/spanDetail';
import {SpanType} from 'app/components/events/interfaces/spans/types';

import {DiffSpanType} from './utils';
import SpanDetailContent from './spanDetailContent';

type Props = {
  span: Readonly<DiffSpanType>;
};

class SpanDetail extends React.Component<Props> {
  renderContent() {
    const {span} = this.props;

    switch (span.comparisonResult) {
      case 'matched': {
        return (
          <MatchedSpanDetailsContent
            baselineSpan={span.baselineSpan}
            regressionSpan={span.regressionSpan}
          />
        );
      }
      case 'regression': {
        return <SpanDetailContent span={span.regressionSpan} />;
      }
      case 'baseline': {
        return <SpanDetailContent span={span.baselineSpan} />;
      }
      default: {
        const _exhaustiveCheck: never = span;
        return _exhaustiveCheck;
      }
    }
  }

  render() {
    return (
      <SpanDetailContainer
        onClick={event => {
          // prevent toggling the span detail
          event.stopPropagation();
        }}
      >
        {this.renderContent()}
      </SpanDetailContainer>
    );
  }
}

const MatchedSpanDetailsContent = (props: {
  baselineSpan: SpanType;
  regressionSpan: SpanType;
}) => {
  const {baselineSpan, regressionSpan} = props;

  return (
    <MatchedSpanDetails>
      <Row
        baselineTitle="Baseline Span ID"
        regressiveTitle="Regressive Span ID"
        renderBaselineContent={() => baselineSpan.span_id}
        renderRegressiveContent={() => regressionSpan.span_id}
      />
      <Row
        title="Parent Span ID"
        renderBaselineContent={() => baselineSpan.parent_span_id || ''}
        renderRegressiveContent={() => regressionSpan.parent_span_id || ''}
      />
      <Row
        title="Trace ID"
        renderBaselineContent={() => baselineSpan.trace_id}
        renderRegressiveContent={() => regressionSpan.trace_id}
      />
      <Row
        title="Description"
        renderBaselineContent={() => baselineSpan.description ?? ''}
        renderRegressiveContent={() => regressionSpan.description ?? ''}
      />
      <Row
        title="Start Date"
        renderBaselineContent={() =>
          getDynamicText({
            fixed: 'Mar 16, 2020 9:10:12 AM UTC',
            value: (
              <React.Fragment>
                <DateTime date={baselineSpan.start_timestamp * 1000} />
                {` (${baselineSpan.start_timestamp})`}
              </React.Fragment>
            ),
          })
        }
        renderRegressiveContent={() =>
          getDynamicText({
            fixed: 'Mar 16, 2020 9:10:12 AM UTC',
            value: (
              <React.Fragment>
                <DateTime date={regressionSpan.start_timestamp * 1000} />
                {` (${baselineSpan.start_timestamp})`}
              </React.Fragment>
            ),
          })
        }
      />
      <Row
        title="End Date"
        renderBaselineContent={() =>
          getDynamicText({
            fixed: 'Mar 16, 2020 9:10:12 AM UTC',
            value: (
              <React.Fragment>
                <DateTime date={baselineSpan.timestamp * 1000} />
                {` (${baselineSpan.timestamp})`}
              </React.Fragment>
            ),
          })
        }
        renderRegressiveContent={() =>
          getDynamicText({
            fixed: 'Mar 16, 2020 9:10:12 AM UTC',
            value: (
              <React.Fragment>
                <DateTime date={regressionSpan.timestamp * 1000} />
                {` (${baselineSpan.timestamp})`}
              </React.Fragment>
            ),
          })
        }
      />
    </MatchedSpanDetails>
  );
};

const MatchedSpanDetails = styled('div')``;

const RowSplitter = styled('div')`
  display: flex;
  flex-direction: row;

  > * + * {
    border-left: 1px solid ${p => p.theme.borderDark};
  }
`;

const Row = (props: {
  title?: string;
  baselineTitle?: string;
  regressiveTitle?: string;

  renderBaselineContent: () => React.ReactNode;
  renderRegressiveContent: () => React.ReactNode;
}) => {
  const {title, baselineTitle, regressiveTitle} = props;

  const baselineContent = props.renderBaselineContent();
  const regressiveContent = props.renderRegressiveContent();

  if (!baselineContent && !regressiveContent) {
    return null;
  }

  return (
    <RowSplitter>
      <RowCell title={baselineTitle ?? title ?? ''}>{baselineContent}</RowCell>
      <RowCell title={regressiveTitle ?? title ?? ''}>{regressiveContent}</RowCell>
    </RowSplitter>
  );
};

const RowContainer = styled('div')`
  width: 50%;
  min-width: 50%;
  max-width: 50%;
  flex-basis: 50%;

  padding-left: ${space(2)};
  padding-right: ${space(2)};
`;

const RowTitle = styled('div')`
  font-size: ${p => p.theme.fontSizeMedium};
  font-weight: 600;
`;

const RowCell = ({title, children}: {title: string; children: React.ReactNode}) => {
  return (
    <RowContainer>
      <RowTitle>{title}</RowTitle>
      <div>
        <pre className="val">
          <span className="val-string">{children}</span>
        </pre>
      </div>
    </RowContainer>
  );
};

// const MatchedSpanDetails = styled('div')`
//   display: flex;
//   flex-direction: row;

//   & > * + * {
//     border-left: 1px solid red;
//   }
// `;

export default SpanDetail;
