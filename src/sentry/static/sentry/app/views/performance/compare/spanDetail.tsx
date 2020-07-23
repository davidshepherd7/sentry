import React from 'react';
import styled from '@emotion/styled';

import space from 'app/styles/space';
import {
  SpanDetailContainer,
  Row,
} from 'app/components/events/interfaces/spans/spanDetail';
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
      <RowSplitter>
        <RowCell title="Baseline Span ID">{baselineSpan.span_id}</RowCell>
        <RowCell title="Regressive Span ID">{regressionSpan.span_id}</RowCell>
      </RowSplitter>
      <RowSplitter>
        <RowCell title="Parent Span ID">{baselineSpan.parent_span_id || ''}</RowCell>
        <RowCell title="Parent Span ID">{regressionSpan.parent_span_id || ''}</RowCell>
      </RowSplitter>
      <RowSplitter>
        <RowCell title="Trace ID">{baselineSpan.trace_id}</RowCell>
        <RowCell title="Trace ID">{regressionSpan.trace_id}</RowCell>
      </RowSplitter>
      <RowSplitter>
        <RowCell title="Description">{baselineSpan.description ?? ''}</RowCell>
        <RowCell title="Description">{regressionSpan.description ?? ''}</RowCell>
      </RowSplitter>
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

const Foo = (props: {children: JSX.Element}) => {
  return (
    <TableContainer>
      <table className="table key-value">
        <tbody>{props.children}</tbody>
      </table>
    </TableContainer>
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
  if (!children) {
    return null;
  }

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

const TableContainer = styled('div')`
  width: 50%;
  min-width: 50%;
  max-width: 50%;
  flex-basis: 50%;

  padding-left: ${space(2)};
  padding-right: ${space(2)};
`;

// const MatchedSpanDetails = styled('div')`
//   display: flex;
//   flex-direction: row;

//   & > * + * {
//     border-left: 1px solid red;
//   }
// `;

export default SpanDetail;
