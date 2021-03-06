import { withPluginApi } from "discourse/lib/plugin-api";

function initialize(api) {
  api.addPostClassesCallback(post => {
    if (post.post_number === 1 && post.can_vote) {
      return ["voting-post"];
    }
  });
  api.includePostAttributes("can_vote");
  api.addTagsHtmlCallback(
    topic => {
      if (!topic.can_vote) {
        return;
      }

      var buffer = [];

      let title = "";
      if (topic.user_voted) {
        title = ` title='${I18n.t("voting.voted")}'`;
      }

      let userVotedClass = topic.user_voted ? " voted" : "";
      buffer.push(
        `<span class='list-vote-count discourse-tag${userVotedClass}'${title}>`
      );

      buffer.push(I18n.t("voting.votes", { count: topic.vote_count }));
      buffer.push("</span>");

      if (buffer.length > 0) {
        return buffer.join("");
      }
    },
    { priority: -100 }
  );
}

export default {
  name: "extend-category-for-voting",

  before: "inject-discourse-objects",

  initialize() {
    withPluginApi("0.8.4", api => initialize(api));
    withPluginApi("0.8.30", api => api.addCategorySortCriteria("votes"));
  }
};
