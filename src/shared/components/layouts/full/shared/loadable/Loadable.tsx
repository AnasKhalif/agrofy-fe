// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Suspense } from 'react';
import Spinner from '@/shared/components/common/Spinner';
import { ChunkErrorBoundary } from '@/app/router/ErrorRouteBoundary';

// ===========================|| LOADABLE - LAZY LOADING ||=========================== //

const Loadable = (Component: any) => (props: any) =>
(
  <ChunkErrorBoundary>
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  </ChunkErrorBoundary>
);

export default Loadable;
