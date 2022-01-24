import React, { useState, useEffect, useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { IconPrefix, IconName } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles( theme => ({
    loading:{
        width: 150,
        height: 300,
    },
    tooltip:{
        fontSize:'0.9rem',
        backgroundColor:theme.palette.common.black
    },
    preview:{
        maxWidth: 300,
        maxHeight: 300,
        borderRadius:theme.spacing(0.5),
    },
    small:{
        maxWidth:64,
        maxHeight:84,
        borderRadius:theme.spacing(0.5),
    },
    compact:{
        maxWidth:64,
        maxHeight:84,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    filename:{
        //fontSize: 16,
        maxWidth: 128,
        overflow: 'hidden',
        display: 'box',
        textOverflow: 'ellipsis',
        maxHeight: theme.spacing(6),      /* fallback */
        lineClamp: 2,   /*ines to show */
        boxOrient: 'vertical',
    },
    root:{
        display:'flex',
        marginBottom: theme.spacing(1),
        flexDirection:'row',
    },
    resource:{
        padding:theme.spacing(0.5),
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    info:{
        display: 'flex',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(4),
        flexDirection: 'column',
    },
    contents:{
        display:'flex',
        alignItems:'center',
        paddingRight: theme.spacing(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filemeta:{
        color: theme.palette.grey[500],
        fontSize: 14,
        fontWeight: 500,
    },
    download:{
        padding: theme.spacing(1),
    },
    icon:{
        color: theme.palette.type === 'light' ? theme.palette.primary['500'] : theme.palette.primary['100'],
		fontSize: theme.spacing(theme.spacing(7/8)),
    },
	smallPreview:{
		display:'flex',
		flexDirection:'column',
        marginTop: theme.spacing(1),
        borderWidth: 0.8,
        borderStyle: 'solid',
        borderColor: theme.palette.grey[400],
        borderRadius: theme.spacing(0.5),
	},
	main:{
		display:'flex',
		flexDirection:'row',
        marginTop: theme.spacing(1),
        borderWidth: 0.8,
        borderStyle: 'solid',
        borderColor: theme.palette.grey[400],
        borderRadius: theme.spacing(0.5),
	}
}));

export const getFileSize = ( size: number ) => {
    let units = 'KB';
    let ratio = 1000;
    if(size >= 1073742000){
        units = 'GB';
        ratio = 1073742000;
    } else if (size >= 1000000){
        units ='MB';
        ratio = 1000000;
    }

    return `${(size/ratio).toFixed(2)}${units}`;
};

export const getFileIcon = ( extension: string ):  [IconPrefix, IconName] => {
    switch( extension.toLowerCase() ){

        case 'pdf':
            return ['far', 'file-pdf'];

        case 'word':
            return ['far', 'file-word'];
        case 'ppt':
            return ['far', 'file-powerpoint'];
        case 'exl':
            return ['far', 'file-excel'];

        case 'jpg':
        case 'png':
        case 'gif':
        case 'jpeg':
            return ['far', 'file-image'];

        case 'csv':
            return ['far', 'file-csv'];

        case 'mp4':
        case 'webm':
            return ['far', 'file-video'];

        case 'js':
        case 'py':
        case 'php':
        case 'css':
        case 'xml':
        case 'html':
            return ['far', 'file-code'];

        case 'bz2':
        case 'zip':
            return ['far', 'file-archive'];

        case 'mp3':
        case 'wave':
            return ['far', 'file-audio'];

        case 'text':
        case 'txt':
            return ['far', 'file-alt'];

        case 'iso':
            return ['far', 'file-upload'];

        default:
            return ['far', 'file'];
    }
};



export default React.memo(({ resource, ...props}: any)=>{

    const theme = useTheme();

	const classes = useStyles();

	const form = useRef<HTMLFormElement>(null);

	const [ size, setSize ] = useState<string>('');

	const [ icon, setIcon ] = useState<[IconPrefix, IconName]>(['far', 'file']);

	const [ loaded, setLoaded ] = useState<boolean>(false);

  	const small = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(()=> {
		setSize(getFileSize(resource.size));
		setIcon(getFileIcon(resource.extension));
	}, [resource.id]);

	function downloadFile(...e: any){
        form.current?.submit();
	}

    function onResourceLoaded(){
        setLoaded(true);
    }

	const { preview } = resource;

	return(
		<div className={classes.root}>
			<div className={(small && preview) ? classes.smallPreview : classes.main}>
				<div className={classes.resource}>
					{preview ?
					<React.Fragment>
						{props.preview === 'compact' ?
							<div className={classes.compact}>
								<img
									src={preview.url}
									alt={resource.name}
									onLoad={onResourceLoaded}
									onLoadedData={onResourceLoaded}
									className={loaded ? classes.small : classes.loading}/>
							</div>
							:
							<img
								src={preview.url}
								alt={resource.name}
								style={{width:preview.width, height:preview.height}}
								onLoad={onResourceLoaded}
								onLoadedData={onResourceLoaded}
								className={loaded ? classes.preview : classes.loading}/>
						}
					</React.Fragment>
					:
					<FontAwesomeIcon
						icon={icon}
						className={classes.icon}/>
					}
				</div>
				<div className={classes.contents}>
					<div className={classes.info}>
						<Tooltip 
							title={resource.name} 
							placement="top" 
							classes={{tooltip:classes.tooltip}}>
							<Typography variant="subtitle2" className={classes.filename}>
								{resource.name}
							</Typography>
						</Tooltip>
						<Typography className={classes.filemeta}>
							{`${resource.extension.toUpperCase()} ${size}`}
						</Typography>
					</div>
					<IconButton 
						onClick={downloadFile}
						className={classes.download}>
						<DownloadIcon fontSize="large"/>
					</IconButton>
				</div>
			</div>
			<form ref={form} method="GET" action={resource.url}/>
		</div>
	);
});

