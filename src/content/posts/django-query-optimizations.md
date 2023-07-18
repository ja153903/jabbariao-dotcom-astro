---
layout: ../../layouts/PostLayout.astro
title: Django ORM - `select_related`
description: Let's talk about how `select_related` can help improve your query performance
date: 2023-07-18
slug: django-select-related
---

Suppose that we have the following models:

```python
class Engagement(models.Model):
    source_type = models.CharField(max_length=256)


class FeedbackRequest(models.Model)
    slug = models.CharField(max_length=256)
    engagement = models.OneToOneField(
        Engagement,
        on_delete=models.CASCADE
    )
```

If for some reason, we wanted to query the `FeedbackRequest` instances and within an iterator, access the `engagement` field,
like the following snippet:

```python
for feedback_request in FeedbackRequest.objects.all()[:15]:
    print(feedback_request.engagement)
```

This would make an extra query every time we call `feedback_request.engagement`.

To improve on this, we can use the Django ORM's `select_related` method which constructs a `JOIN` query with the related field once rather than making the query every time we access the related field.

```python
feedback_request_qs = (
    FeedbackRequest.objects
        .select_related('engagement')
        .all()[:15]
)
for feedback_request in feedback_request_qs:
    print(feedback_request.engagement)
```

So if we profile this query now, we'll see that we've only made one query and all of our accesses to `engagement` won't make another query.