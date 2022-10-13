import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

const Appointment = ({
  id,
  time,
  interview,
  interviewers,
  bookInterview,
  cancelInterview,
}) => {
  const initial = interview ? SHOW : EMPTY;
  const { mode, transition, back } = useVisualMode(initial);

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    bookInterview(id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch(() => {
        transition(ERROR_SAVE, true);
      });
  };

  const deleted = id => {
    transition(CONFIRM, true);
    transition(DELETING, true);
    cancelInterview(id)
      .then(() => {
        transition(EMPTY);
      })
      .catch(() => {
        transition(ERROR_DELETE, true);
      });
  };

  return (
    <article className="appointment" data-testid="appointment" >
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          {...interview}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          id={id}
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === CONFIRM && (
        <Confirm
          id={id}
          message={"Delete the appointment?"}
          onConfirm={deleted}
          onCancel={() => transition(SHOW)}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
          studentName={interview.student}
          interviewerID={interview.interviewer.id}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message={"Error Delete"}
          onClose={() => {
            back();
            back();
          }}
        />
      )}

      {mode === ERROR_SAVE && (
        <Error
          message={"Error Save"}
          onClose={() => {
            back();
            back();
          }}
        />
      )}
    </article>
  );
};

export default Appointment;
