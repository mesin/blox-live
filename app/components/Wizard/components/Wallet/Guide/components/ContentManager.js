import React from 'react';
import PropTypes from 'prop-types';
import Text from './Text';
import Image from './Image';
import Video from './Video';
import SubTitle from './SubTitle';

import image2 from '../assets/aws-guide-02.svg';
import image3 from '../assets/aws-guide-03.svg';
import image4 from '../assets/aws-guide-04.svg';
import image5 from '../assets/aws-guide-05.svg';
import image6 from '../assets/aws-guide-06.svg';

const youtubeLink = 'https://www.youtube.com/embed/pr-PHUt5hN4?&vq=hd720';

const ContentManager = ({page}) => {
  switch (page) {
    case 1:
      return (
        <>
          <Text>
            In order to establish a connection between your validator
            and BloxStaking, we need to generate unique access keys.
            Those keys are yours, and yours alone. <br /> <br />
            Here&apos;s how to do it:
          </Text>
          <Video youtubeLink={youtubeLink} />
          <SubTitle>Select IAM Service</SubTitle>
          <Text>
            In your AWS Management Console, search for <b>&apos;IAM&apos;</b> inside the
            <b>&apos;Find Services&apos;</b> search bar. Click on it.
          </Text>
        </>
      );
    case 2:
      return (
        <>
          <Image src={image2} />
          <SubTitle>Add User</SubTitle>
          <Text>
            On the <b>&apos;Identity and Access Management&apos;</b> page, click on <b>&apos;Users:&apos;</b> to
            create a new IAM user, and then click on <b>&apos;Add User&apos;</b> at the top.
          </Text>
        </>
      );
    case 3:
      return (
        <>
          <Image src={image3} />
          <SubTitle>Set User Details</SubTitle>
          <Text>
            Set a memorable name (e.g. Blox_Staking), check the <b>&apos;Programmatic access&apos;</b> checkbox, and click Next.
          </Text>
        </>
      );
    case 4:
      return (
        <>
          <Image src={image4} />
          <SubTitle>Set Permissions</SubTitle>
          <Text>
            On the <b>&apos;Set Permissions&apos;</b> step, select <b>&apos;Attach Existing Policies Directly&apos;</b>,
            and then filter the results by typing <b>&apos;EC2&apos;</b> and select <b>&apos;Amazon EC2 Full Access&apos;</b>.
            When done, click Next.
          </Text>
        </>
      );
    case 5:
      return (
        <>
          <Image src={image5} />
          <SubTitle>Review &amp; Create</SubTitle>
          <Text>
            Skip the <b>&apos;Tags&apos;</b> step and click <b>&apos;Next: Review&apos;</b>. On the review step,
            make sure the information is correct, and click <b>&apos;Create User&apos;</b> to finish.
          </Text>
        </>
      );
    case 6:
      return (
        <>
          <Image src={image6} />
          <SubTitle>Access Keys Created!</SubTitle>
          <Text>
            Now Copy the given <b>&apos;Access Key ID&apos;</b> and <b>&apos;Secret Access Key&apos;</b> and paste
            them into the input fields inside Blox. <br /> <br />

            Once done, click <b>&apos;Continue&apos;</b> and you are all set!
          </Text>
        </>
      );
  }
};

ContentManager.propTypes = {
  page: PropTypes.number,
};

export default ContentManager;
