import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function YouTubeForm() {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
  }));

  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeSummary, setYoutubeSummary] = useState('');
  const [language, setLanguage] = useState('English');
  const [videoFile, setVideoFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };
  const handleUrlChange = (event) => {
    setYoutubeUrl(event.target.value);
    console.log(event.target.value,"url")
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(youtubeUrl,"submit")
    getVideoSummary(youtubeUrl,"en")
  };
  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleFileChange = event => {
    const fileUploaded = event.target.files[0];
    let reader = new FileReader();

    reader.readAsText(fileUploaded);
  
    reader.onload = function() {
      console.log(reader.result,"one");
      setFileName(fileUploaded.name);
      setVideoFile(event.target.files[0]);
    };
  
    reader.onerror = function() {
      console.log(reader.error);
    };
    console.log(fileUploaded,"file")
  };
  
const { getSubtitles } = require('youtube-captions-scraper');
const { Configuration, OpenAIApi } = require("openai");

const getVideoSubtitle = async(id, lan)=> {
 const captions = await getSubtitles({
    videoID: id, // youtube video id
    lang: lan, // default: `en`
    headers: {'Access-Control-Allow-Origin':'*'},
    mode:'no-cors'
  })
  const videsubtitle = captions.map(t=> t.text)
  const refinesubtitle = videsubtitle.join('').replace(/\[music\]/i, "")
  return refinesubtitle;
}

const configuration = new Configuration({
  apiKey: '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'
});

const openai = new OpenAIApi(configuration);
// useEffect((youtubeSummary)=>{
  // const [youtubeSummary, setYoutubeSummary] = useState('');
  const getVideoSummary = async()=> {
    const subtitles = await getVideoSubtitle(youtubeUrl, 'en');
    const paragraph =`Please give short summary of the following paragraph in bullet points in ${language} language:
    ${subtitles}`
    const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: paragraph,
        max_tokens: 2000,
        temperature: 0.5
    });
    console.log("summary of youtubevide", completion.data);
    setYoutubeSummary(completion.data.choices[0].text);
  }
// })

  return (
    <form onSubmit={handleSubmit}>
      <Box 
        sx={{ 
          p: 2,
          minWidth: 300,
        }}
      >
        <Grid container align="center" rowSpacing={5} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
          <Grid item xs={12} >
          </Grid>
          <Grid item xs={4}>
            <TextField id="outlined-basic" placeholder="Enter YouTube Video ID" variant="outlined" size="small" fullWidth value={youtubeUrl} onChange={handleUrlChange}/>
          </Grid>
          <Grid item xs={2}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={language}
              onChange={handleChange}
              size="small"
            >
              <MenuItem value={'Hindi'}>Hindi</MenuItem>
              <MenuItem value={'Kannada'}>Kannada</MenuItem>
              <MenuItem value={'Telugu'}>Telugu</MenuItem>
              <MenuItem value={'Spanish'}>Spanish</MenuItem>
              <MenuItem value={'Korean'}>Korean</MenuItem>
              <MenuItem value={'French'}>French</MenuItem>
              <MenuItem value={'English'}>English</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={1}>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </Grid>
          <Grid item xs={3}>
          <Button variant="contained" onClick={handleClick}>
            Upload a file
          </Button>
          <input type="file"
            ref={hiddenFileInput}
            onChange={handleFileChange}
            style={{display:'none'}} 
          /> 
            {fileName}
          </Grid>
          <Grid item xs={12}>
            { youtubeSummary ? 
            <Item>
              <h4>Summary</h4>
              <p>{ youtubeSummary } </p>
            </Item>
             : "" }
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}
export default YouTubeForm;