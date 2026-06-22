import React, {type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import ShareButton from '@site/src/components/ShareButton';

type Props = WrapperProps<typeof ContentType>;

// Renders the "Copy share link" button at the top of every doc page, above the
// article content. ShareButton renders null when no password is configured, so
// this swizzle is inert on ungated portals.
export default function ContentWrapper(props: Props): ReactNode {
  return (
    <>
      <ShareButton />
      <Content {...props} />
    </>
  );
}
