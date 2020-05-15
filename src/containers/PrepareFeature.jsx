import React from 'react';
import {
  Container,
  ContentWrapper,
  PrepareFeatureContent
} from 'components/common';

export default function PrepareFeature() {
  return (
    <Container>
      <ContentWrapper
        title="Nội dung"
      >
        <PrepareFeatureContent />
      </ContentWrapper>
    </Container>
  );
}
