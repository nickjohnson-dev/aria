import { useMutation } from '@apollo/client';
import isNil from 'lodash/fp/isNil';
import React from 'react';

import * as queries from '../queries';

export default function useUpdateTrack(...args) {
  const [mutation, ...rest] = useMutation(queries.UPDATE_TRACK, ...args);

  const wrappedMutation = React.useCallback(
    async ({ input }) => {
      try {
        await mutation({
          optimisticResponse: {
            __typename: 'Mutation',
            updateTrack: {
              message: '',
              success: true,
              track: {
                id: input.id,
                ...(!isNil(input.voice) ? { voice: input.voice } : {}),
                ...(!isNil(input.volume) ? { volume: input.volume } : {}),
                __typename: 'Track',
              },
            },
          },
          variables: {
            input: {
              id: input.id,
              ...(!isNil(input.voice) ? { voiceId: input.voice.id } : {}),
              ...(!isNil(input.volume) ? { volume: input.volume } : {}),
            },
          },
        });
      } catch (e) {
        console.error(e.message);
      }
    },
    [mutation],
  );

  return [wrappedMutation, ...rest];
}