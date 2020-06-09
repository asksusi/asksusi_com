import tableStyles from '../../shared/table';

export const getColumnConfig = (groups) => {
  return [
    {
      title: 'Name',
      field: 'skillName',
      cellStyle: {
        width: '20%',
        ...tableStyles,
      },
      filtering: false,
    },
    {
      title: 'Group',
      field: 'group',
      lookup: groups,
      cellStyle: {
        width: '10%',
        ...tableStyles,
      },
    },
    {
      title: 'Language',
      field: 'language',
      cellStyle: {
        width: '10%',
        ...tableStyles,
      },
      filtering: false,
    },
    {
      title: 'Type',
      field: 'type',
      lookup: { private: 'Private', public: 'Public' },
      cellStyle: {
        width: '10%',
        ...tableStyles,
      },
    },
    {
      title: 'Author',
      field: 'author',
      cellStyle: {
        width: '10%',
        ...tableStyles,
      },
      filtering: false,
    },
    {
      title: 'Review Status',
      field: 'reviewed',
      lookup: { Approved: 'Reviewed', 'Not Reviewed': 'Not Reviewed' },
      cellStyle: {
        width: '15%',
        ...tableStyles,
      },
    },
    {
      title: 'Edit Status',
      field: 'editable',
      lookup: { Editable: 'Editable', 'Not Editable': 'Not Editable' },
      cellStyle: {
        width: '15%',
        ...tableStyles,
      },
    },
  ];
};
