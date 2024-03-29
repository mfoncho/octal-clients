import React from 'react';
import { useTheme, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

export interface BarsProps {
    fill?: string;
    style?: any;
    duration?: number | string;
}

const useStyles = makeStyles( (theme: Theme ) => ({
	root:{
		enableBackground: 'new 0 0 50 50'
	}
}))

export default React.memo( ({ style, fill, duration } : BarsProps ) => {

	const theme = useTheme();

	const classes = useStyles();

	fill =  fill ? fill : theme.palette.primary.main;

	duration = duration ? `${duration}s` : '1s';

	switch( style ) {

		case 2:
			return (
				<svg fill={fill} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 width="24px" height="30px" viewBox="0 0 24 30" className={classes.root} xmlSpace="preserve">
					<rect x="0" y="13" width="4" height="5">
					  <animate attributeName="height" attributeType="XML"
						values="5;21;5"
						begin="0s" dur={duration} repeatCount="indefinite" />
					  <animate attributeName="y" attributeType="XML"
						values="13; 5; 13"
						begin="0s" dur={duration} repeatCount="indefinite" />
					</rect>
					<rect x="10" y="13" width="4" height="5">
					  <animate attributeName="height" attributeType="XML"
						values="5;21;5"
						begin="0.15s" dur={duration} repeatCount="indefinite" />
					  <animate attributeName="y" attributeType="XML"
						values="13; 5; 13"
						begin="0.15s" dur={duration} repeatCount="indefinite" />
					</rect>
					<rect x="20" y="13" width="4" height="5">
					  <animate attributeName="height" attributeType="XML"
						values="5;21;5"
						begin="0.3s" dur={duration} repeatCount="indefinite" />
					  <animate attributeName="y" attributeType="XML"
						values="13; 5; 13"
						begin="0.3s" dur={duration} repeatCount="indefinite" />
					</rect>
				</svg>
			);


		case 3:
			return (
				<svg fill={fill} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 width="24px" height="30px" viewBox="0 0 24 30" className={classes.root} xmlSpace="preserve">
					<rect x="0" y="10" width="4" height="10" opacity="0.2">

						<animate 
							attributeName="opacity" 
							attributeType="XML" 
							values="0.2; 1; .2" 
							begin="0s" 
							dur={duration}
							repeatCount="indefinite" />

						<animate 
							attributeName="height" 
							attributeType="XML" 
							values="10; 20; 10" 
							begin="0s" 
							dur={duration}
							repeatCount="indefinite" />

						<animate 
							attributeName="y" 
							attributeType="XML" 
							values="10; 5; 10" 
							begin="0s" 
							dur={duration}
							repeatCount="indefinite" />

					</rect>

					<rect x="8" y="10" width="4" height="10" opacity="0.2">
						<animate 
							attributeName="opacity" 
							attributeType="XML" 
							values="0.2; 1; .2" 
							begin="0.15s" 
							dur={duration}
							repeatCount="indefinite" />
						<animate 
							attributeName="height" 
							attributeType="XML" 
							values="10; 20; 10" 
							begin="0.15s" 
							dur={duration}
							repeatCount="indefinite" />
						<animate 
							attributeName="y" 
							attributeType="XML" 
							values="10; 5; 10" 
							begin="0.15s" 
							dur={duration}
							repeatCount="indefinite" />
					</rect>

					<rect x="16" y="10" width="4" height="10" opacity="0.2">
						<animate 
							attributeName="opacity" 
							attributeType="XML" 
							values="0.2; 1; .2" 
							begin="0.3s" 
							dur={duration}
							repeatCount="indefinite" />

						<animate 
							attributeName="height" 
							attributeType="XML" 
							values="10; 20; 10" 
							begin="0.3s" 
							dur={duration}
							repeatCount="indefinite" />

						<animate 
							attributeName="y" 
							attributeType="XML" 
							values="10; 5; 10" 
							begin="0.3s" 
							dur={duration}
							repeatCount="indefinite" />
					</rect>
				</svg>
			);


		case 4:
			return (
				<svg fill={fill} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 width="24px" height="30px" viewBox="0 0 24 30" className={classes.root} xmlSpace="preserve">
					<rect x="0" y="0" width="4" height="10">
						<animateTransform 
                            attributeType="xml"
							attributeName="transform" 
							type="translate"
							values="0 0; 0 20; 0 0"
							begin="0" 
							dur={duration}
							repeatCount="indefinite" />
					</rect>
					<rect x="10" y="0" width="4" height="10">
						<animateTransform 
							attributeType="xml"
							attributeName="transform" 
							type="translate"
							values="0 0; 0 20; 0 0"
							begin="0.2s" 
							dur={duration}
							repeatCount="indefinite" />
					</rect>
					<rect x="20" y="0" width="4" height="10">
						<animateTransform 
							attributeType="xml"
							attributeName="transform" 
							type="translate"
							values="0 0; 0 20; 0 0"
							begin="0.4s" 
							dur={duration}
							repeatCount="indefinite" />
					</rect>
				</svg>
			);


		case 1:
		default: 
			return(
				<svg fill={fill} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 width="24px" height="30px" viewBox="0 0 24 30" className={classes.root} xmlSpace="preserve">
					<rect x="0" y="0" width="4" height="20">
						<animate 
							attributeName="opacity" 
							attributeType="XML"
							values="1; .2; 1"
							begin="0s" 
							dur={duration}
							repeatCount="indefinite" />
					</rect>
					<rect x="7" y="0" width="4" height="20">
						<animate 
							attributeName="opacity" 
							attributeType="XML"
							values="1; .2; 1"
							begin="0.2s" 
							dur={duration}
							repeatCount="indefinite" />
					</rect>
					<rect x="14" y="0" width="4" height="20">
						<animate 
							attributeName="opacity" 
							attributeType="XML"
							values="1; .2; 1"
							begin="0.4s" 
							dur={duration}
							repeatCount="indefinite" />
					</rect>
				</svg>
			);

	}

});
