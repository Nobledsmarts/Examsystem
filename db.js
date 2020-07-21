export const db = {
    '_' : {
        'admin' : {
            'pass' : '1',
        }
    },
    'login' : {
        'isAdmin' : false,
    },
    'settings' : {
        'termId' : '1',
        'currentExam' : {
            'subject' : 'chemistry',
            'duration' : '2:00',
        },
        'students' : {
            'perpage' : 10,
        }
    },
    'teachers' : {
        'id' : [
            {
                'name' : 'mr teacher 1',
                'subject' : 'chemistry',
                'gender' : 'male'
            },
            {
                'name' : 'mr teacher 2',
                'subject' : 'physics',
                'gender' : 'male'

            }
        ]
    },
    'users' : {
        'reg' : [
            {
                'name' : 'richard Franklin Chinedu',
                'firstname' : 'richard',
                'middlename' : 'Franklin',
                'lastname' : 'Chinedu',
                'age' : '21',
                'subjects' : ['english', 'maths', 'civic', 'geography'],
                gender : 'male',

            },
            {
                'name' : 'Randomm Person Username',
                'firstname' : 'Random',
                'middlename' : 'Person',
                'lastname' : 'Username',
                'age' : '18',
                'subjects' : ['english', 'maths', 'civic', 'geography', 'physics'],
                gender : 'female'
            },
            {
                'name' : 'Person Username angela',
                'firstname' : 'Person',
                'middlename' : 'Username',
                'lastname' : 'angela',
                'age' : '20',
                'subjects' : ['english', 'maths', 'civic', 'geography', 'agric'],
                gender : 'female'
            }
        ]
    },
    'subjects' : [
        {
            'subject' : 'chemistry',
            'options' : {
                'classes' : ['col-md-12', 'bg-danger', 'shadow'],
                    'imgsrc' : './img/book_2.svg',
                    'style' : {
                        'background' : '#dc3545',
                        'color' : '#f0f8ff',
                    },
            },
            'term' : {
                'firstTerm' : {
                    'questions' : [],
                    'marks' : 1,
                },
                secondTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
                thirdTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
            }
        },
    
        {
            'subject' : 'physics',
            'options' : {
                'classes' : ['col-md-12', 'bg-info', 'shadow'],
                    'imgsrc' : './img/book_2.svg',
                    'style' : {
                        'background' : '#17a2b8',
                        'color' : '#f0f8ff',
                    },
                    
            },
            'term' : {
                'firstTerm' : {
                    'questions' : [],
                    'marks' : 1,
                },
                secondTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
                thirdTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
            }
        },
        {
            'subject' : 'maths',
            'options' : {
                'classes' : ['col-md-12', 'shadow'],
                'imgsrc' : './img/book_2.svg',
                'style' : {
                        'background' : '#ffffff',
                        'color' : 'rgba(0,0,0,0.5)',
                    },
            },
            'term' : {
                'firstTerm' : {
                    'questions' : [],
                    'marks' : 1,
                },
                secondTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
                thirdTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
            }
        },
        {
            'subject' : 'english',
            'options' : {
                'classes' : ['col-md-12', 'shadow'],
                'imgsrc' : './img/book_2 - w.svg',
                'style' : {
                        'background' : '#343a40',
                        'color' : '#f0f8ff',
                    },
            },
            'term' : {
                'firstTerm' : {
                    'questions' : [],
                    'marks' : 1,
                },
                secondTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
                thirdTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
            }
        },
        {
            'subject' : 'geography',
            'options' : {
                'classes' : ['col-md-12',  'shadow'],
                'imgsrc' : './img/book_2 - w.svg',
                'style' : {
                        'background' : '#6c757d',
                        'color' : '#f0f8ff',
                    },
            },
            'term' : {
                'firstTerm' : {
                    'questions' : [],
                    'marks' : 1,
                },
                secondTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
                thirdTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
            }
        },
        {
            'subject' : 'biology',
            'options' : {
                'classes' : ['col-md-12', 'shadow'],
                'imgsrc' : './img/book_2 - w.svg',
                'style' : {
                        'background' : '#a52a2a',
                        'color' : '#f0f8ff',
                    },
            },
            'term' : {
                'firstTerm' : {
                    'questions' : [],
                    'marks' : 1,
                },
                secondTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
                thirdTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
            }
        },
        {
            'subject' : 'civic',
            'options' : {
                'classes' : ['col-md-12', 'shadow'],
                'imgsrc' : './img/book_2.svg',
                'style' : {
                        'background' : '#ffc107',
                        'color' : '#f0f8ff',
                    },
            },
            'term' : {
                'firstTerm' : {
                    'questions' : [],
                    'marks' : 1,
                },
                secondTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
                thirdTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
            }
        },
        {
            'subject' : 'agric',
            'options' : {
                'classes' : ['col-md-12', 'shadow'],
                'imgsrc' : './img/book_2.svg',
                'style' : {
                        'background' : '#28a745',
                        'color' : '#f0f8ff',
                    },
            },
            'term' : {
                'firstTerm' : {
                    'questions' : [],
                    'marks' : 1,
                },
                secondTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
                thirdTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
            }
        },
        {
            'subject' : 'economics',
            'options' : {
                'classes' : ['col-md-12', 'shadow'],
                'imgsrc' : './img/book_2 - w.svg',
                'style' : {
                        'background' : '#008080',
                        'color' : '#f0f8ff',
                    },
            },
            'term' : {
                'firstTerm' : {
                    'questions' : [],
                    'marks' : 1,
                },
                secondTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
                thirdTerm : {
                    'questions' : [],
                    'marks' : 1,
                },
            }
        },
    ]
}
