import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

import { makeStyles, useTheme } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: " #fff",
        borderRadius: "10px",
        maxHeight: "500px",
        maxWidth: "300px",
        minHeight: "400px",
        minWidth: "250px",
        boxShadow: '0 3px 5px 2px #aaa',
        margin: "10px auto 20px",
         padding: "20px"
    },
    container: {
         alignItems: "center",
        justifyContent: "center"

    },
    form: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginBlock: "15px"
    },
    image: {
        maxHeight: "300px",
        maxWidth: "400px"
    },
    sort: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
         marginBlock: "15px",

    }
}));

function Search(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [searchInput, setSearchInput] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [searchQuery, setSearchQuery] = useState(null);


    const handleSearchInput = e => {
        setSearchInput(e.target.value);
    }

    useEffect(() => {
        if (searchQuery) {
            fetch(`http://www.omdbapi.com/?s=${searchQuery}&apikey=6715d830`)
                .then(resp => resp)
                .then(resp => resp.json())
                .then(response => {
                    if (response.Response === 'False') {
                        console.log(response.Error);

                        if (searchInput.length > 3) {
                            let newQuery = searchInput.slice(0, 3);
                            setSearchQuery(newQuery);
                        }


                    }
                    else {
                        setSearchResult(response.Search);

                    }

                })
                .catch(({ message }) => {
                    console.log("error")
                })
        }
    }, [searchQuery])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSearchQuery(searchInput);


    };
    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const itemsReorder = reorder(
            searchResult,
            result.source.index,
            result.destination.index
        );

        setSearchResult(itemsReorder);
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const sortYear = () => {
        const sortArray = [].concat(searchResult);
        sortArray.sort((a, b) => a.Year > b.Year ? 1 : -1);
        setSearchResult(sortArray);
    }
    const sortYearDesc = () => {
        const sortArray = [].concat(searchResult);
        sortArray.sort((a, b) => a.Year > b.Year ? -1 : 1);
        setSearchResult(sortArray);
    }
    const sortTitle = () => {
        const sortArray = [].concat(searchResult);
        sortArray.sort((a, b) => a.Title > b.Title ? 1 : -1);
        setSearchResult(sortArray);
    }
    const sortTitleDesc = () => {
        const sortArray = [].concat(searchResult);
        sortArray.sort((a, b) => a.Title > b.Title ? -1 : 1);
        setSearchResult(sortArray);
    }

    return (
        <div>
            <form className="search" className={classes.form}>

                <TextField onChange={handleSearchInput} label="Search for movies..." variant="outlined" />



                <IconButton variant="outlined" color="primary" onClick={handleSubmit} type="submit" >
                    <SearchIcon />
                </IconButton>

            </form>
            <div className={classes.sort}>
                <Typography variant="subtitle2" color="textSecondary">
                    Sort by Title :
                                                        </Typography>
                <IconButton variant="outlined" color="primary" onClick={sortTitle} type="submit" >
                    <ArrowUpwardIcon fontSize="small"/>
                </IconButton>
                <IconButton variant="outlined" color="primary" onClick={sortTitleDesc} type="submit" >
                    <ArrowDownwardIcon  fontSize="small"/>
                </IconButton>

                <Typography variant="subtitle2" color="textSecondary">
                    Sort by Year :
                                                        </Typography>
                <IconButton variant="outlined" color="primary" onClick={sortYear} type="submit" >
                    <ArrowUpwardIcon fontSize="small"/>
                </IconButton>
                <IconButton variant="outlined" color="primary" onClick={sortYearDesc} type="submit" >
                    <ArrowDownwardIcon fontSize="small"/>
                </IconButton>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" onDragEnd={onDragEnd}>
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}

                        >
                            {searchResult?.map((item, index) => (
                                <Draggable key={index} draggableId={item.imdbID} index={index}>
                                    {(provided, snapshot) => (
                                        <Grid container spacing={2} className={classes.container} >

                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            > <Grid item xs={8} className={classes.paper}>
                                                    <Card className={classes.root}>

                                                        <Typography variant="h5" component="h2">{item.Title} </Typography>

                                                        <Typography variant="h6" color="textSecondary">
                                                            ({item.Year})
                                                        </Typography>

                                                        <div>

                                                            <CardMedia className={classes.image}
                                                                component="img"
                                                                alt={`The movie titled: ${item.Title}`}
                                                                height="300px"
                                                                width="400px"
                                                                image={item.Poster}
                                                            />
                                                        </div>

                                                    </Card>
                                                </Grid>
                                            </div>

                                        </Grid>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>


        </div>
    );
}

export default Search;