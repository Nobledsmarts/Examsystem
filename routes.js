    import login from './views/user/login-component.js';
    import adminlogin from './views/admin/login-component.js';
    import adminHomeComponent from './views/admin/home-component.js';
    import subjectComponent from './views/admin/subject-component.js';
    import loginconfirm from './views/user/loginconfirm-component.js';
    import home from './views/user/home-component.js';
    import { subjectlist, settings, students, newSubject } from './views/admin/templates.js';
    import previewComponent from './views/admin/preview-component.js';
    import backup from './views/admin/backup.js';

 export const routes = [
    {
        path : '/',
        redirect : '/app/user/login',
        children : [
            {
                path : 'app',
                redirect : '/app/user/login',
            },
            {
                path : 'app/user',
                redirect : '/app/user/login',
            }
        ]
    },

    {
        path : '/app/user/login',
        component : login,
    },
    {
        path : '/app/user/exam',
        component : home
    },
    {
        path : '/app/user/login/confirm',
        component : loginconfirm,
    },
    {
        path : '/app/admin/login',
        component : adminlogin,
    },
    {
        path : '/app/admin',
        component : adminHomeComponent,
        children : [
            {
                path : '',
                props : true,
                component : subjectlist,
            },
            {
                path : 'settings',
                props : true,
                component : settings,
            },
            {
                path : 'students',
                props : true,
                component : students,
            },
            {
                path : 'newsubject',
                props : true,
                component : newSubject,
            }
        ]
    },
    {
        path : '/app/admin/subjects/:subject',
        component : subjectComponent,
    },
    {
        path : '/app/admin/questions/preview',
        component : previewComponent,
    },
    {
        path : '/app/admin/backup/db',
        component : backup,
    },
];