import React from 'react';
import { List, ListItem, ListItemText, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import classNames from 'classnames';
import './SelectedFileList.css';
import { truncateFilename } from '../../../utils/utils';

const SelectedFileList = ({ files, onRemoveFile }) => {
  return (
    <div className={classNames('selected-file-list-container')}>
      {files.length > 0 && (
        <List dense>
          {files.map((file, index) => (
            <ListItem 
              key={index}
              className={classNames('selected-file-item')}
              sx={{ display: 'flex', justifyContent: 'space-between' }} // Use sx prop for inline styling
            >
              <Tooltip title={file.name} arrow classes={{ tooltip: 'custom-tooltip' }}>
                <ListItemText primary={truncateFilename(file.name)} className="file-name" />
              </Tooltip>
              <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFile(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default SelectedFileList;
