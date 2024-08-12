import { Button } from '@kursor/react/form/button';
import React, { FC } from 'react';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';

export const AddPostButton: FC<{ onClick: () => void; num: number }> = (
  props,
) => {
  const { onClick, num } = props;

  useCopilotAction({
    name: 'addPost_' + num,
    description: 'Add a post after the post number ' + (num + 1),
    handler: () => {
      onClick();
    },
  });

  return (
    <Button
      onClick={onClick}
      className="flex !h-[24px] w-[102px] gap-[4px] rounded-[3px] text-[12px] font-[500]"
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M7 1.3125C5.87512 1.3125 4.7755 1.64607 3.8402 2.27102C2.90489 2.89597 2.17591 3.78423 1.74544 4.82349C1.31496 5.86274 1.20233 7.00631 1.42179 8.10958C1.64124 9.21284 2.18292 10.2263 2.97833 11.0217C3.77374 11.8171 4.78716 12.3588 5.89043 12.5782C6.99369 12.7977 8.13726 12.685 9.17651 12.2546C10.2158 11.8241 11.104 11.0951 11.729 10.1598C12.3539 9.2245 12.6875 8.12488 12.6875 7C12.6859 5.49207 12.0862 4.04636 11.0199 2.98009C9.95365 1.91382 8.50793 1.31409 7 1.3125ZM7 11.8125C6.04818 11.8125 5.11773 11.5303 4.32632 11.0014C3.53491 10.4726 2.91808 9.72103 2.55383 8.84166C2.18959 7.96229 2.09428 6.99466 2.27997 6.06113C2.46566 5.12759 2.92401 4.27009 3.59705 3.59705C4.27009 2.92401 5.1276 2.46566 6.06113 2.27997C6.99466 2.09428 7.9623 2.18958 8.84167 2.55383C9.72104 2.91808 10.4726 3.53491 11.0015 4.32632C11.5303 5.11773 11.8125 6.04818 11.8125 7C11.8111 8.27591 11.3036 9.49915 10.4014 10.4014C9.49915 11.3036 8.27591 11.8111 7 11.8125ZM9.625 7C9.625 7.11603 9.57891 7.22731 9.49686 7.30936C9.41481 7.39141 9.30353 7.4375 9.1875 7.4375H7.4375V9.1875C7.4375 9.30353 7.39141 9.41481 7.30936 9.49686C7.22731 9.57891 7.11603 9.625 7 9.625C6.88397 9.625 6.77269 9.57891 6.69064 9.49686C6.6086 9.41481 6.5625 9.30353 6.5625 9.1875V7.4375H4.8125C4.69647 7.4375 4.58519 7.39141 4.50314 7.30936C4.4211 7.22731 4.375 7.11603 4.375 7C4.375 6.88397 4.4211 6.77269 4.50314 6.69064C4.58519 6.60859 4.69647 6.5625 4.8125 6.5625H6.5625V4.8125C6.5625 4.69647 6.6086 4.58519 6.69064 4.50314C6.77269 4.42109 6.88397 4.375 7 4.375C7.11603 4.375 7.22731 4.42109 7.30936 4.50314C7.39141 4.58519 7.4375 4.69647 7.4375 4.8125V6.5625H9.1875C9.30353 6.5625 9.41481 6.60859 9.49686 6.69064C9.57891 6.77269 9.625 6.88397 9.625 7Z"
            fill="white"
          />
        </svg>
      </div>
      <div>Add comment</div>
    </Button>
  );
};
